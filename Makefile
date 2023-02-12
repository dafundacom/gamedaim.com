SHELL := /bin/bash
.DEFAULT_GOAL := help

############################
# HELPER TARGETS
############################

.PHONY: help
help:  ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) |  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

############################
# GENERAL
############################
.PHONY: build
build:  ## build docker image for all tools
	docker-compose build --no-cache

.PHONY: start
start:  ## build docker image for all tools
	docker-compose up --build

.PHONY: start-d
start-d:  ## build docker image for all tools
	docker-compose up -d --build

.PHONY: down
down:  ## build docker image for all tools
	docker-compose down
