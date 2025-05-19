export POSTGRES_URL="postgres://postgres:password@localhost:5432/ags_products_db?sslmode=disable"

migrate-create:
	@ migrate create -ext sql -dir migration -seq $(name)

migrate-up:
	@ migrate -database ${POSTGRES_URL} -path migration up

migrate-down:
	@ migrate -database ${POSTGRES_URL} -path migration down
	