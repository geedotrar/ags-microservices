package routes

import (
	"net/http"

	"product-service/internal/handlers"
	"product-service/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type ProductRouter interface {
	Mount()
}

type productRouterImpl struct {
	v       *gin.RouterGroup
	handler handlers.ProductHandler
}

func NewProductRouter(v *gin.RouterGroup, handler handlers.ProductHandler) ProductRouter {
	return &productRouterImpl{v: v, handler: handler}
}

func RequireAnyPermission(permissions ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claimsRaw, exists := c.Get("claims")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "No claims found"})
			return
		}

		claims, ok := claimsRaw.(struct {
			middleware.UserClaims
			Permissions []string
		})
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid claims type"})
			return
		}

		for _, perm := range permissions {
			for _, p := range claims.Permissions {
				if p == perm {
					c.Next()
					return
				}
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Permission denied"})
	}
}

func (r *productRouterImpl) Mount() {
	r.v.Use(cors.Default())
	r.v.Use(middleware.AuthMiddleware())
	r.v.GET("", RequireAnyPermission("view_all_products", "view_active_products"), r.handler.GetAllProducts)

	r.v.POST("/create", middleware.RequirePermission("create_products"), r.handler.CreateProduct)
	r.v.PUT("/update/:id", middleware.RequirePermission("update_products"), r.handler.UpdateProduct)
	r.v.PUT("/update-status/:id", middleware.RequirePermission("update_products"), r.handler.UpdateProductStatus)
	r.v.DELETE("/delete/:id", middleware.RequirePermission("delete_products"), r.handler.DeleteProduct)
}
