package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claimsRaw, exists := c.Get("claims")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "No claims found"})
			return
		}

		claims, ok := claimsRaw.(struct {
			UserClaims
			Permissions []string
		})
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid claims type"})
			return
		}

		for _, p := range claims.Permissions {
			if p == permission {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
	}
}
