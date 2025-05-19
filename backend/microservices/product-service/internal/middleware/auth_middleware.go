package middleware

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type UserClaims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		token := c.GetHeader("Authorization")
		if !strings.HasPrefix(token, "Bearer ") {
			token = "Bearer " + token
		}

		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			return
		}

		accessURL := os.Getenv("AUTH_ACCESS_URL")
		req, err := http.NewRequest("GET", accessURL, nil)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		req.Header.Set("Authorization", token)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}

		var respData struct {
			User        UserClaims `json:"user"`
			Permissions []string   `json:"permissions"`
		}

		if err := json.Unmarshal(body, &respData); err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token response"})
			return
		}

		claimsWithPerm := struct {
			UserClaims
			Permissions []string
		}{
			UserClaims:  respData.User,
			Permissions: respData.Permissions,
		}

		c.Set("claims", claimsWithPerm)
		c.Next()
	}
}
