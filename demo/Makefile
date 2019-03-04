TAG = $(shell date +%Y%m%d%H%M%S)
BETA_TAG=beta
LASTEST_TAG=latest
REGISTRY=masongzhi
NAME=react-image-crop-upload
BRANCH_NAME=$(shell git rev-parse --abbrev-ref HEAD)

prod:
	echo building ${NAME}:prod
	docker build -t ${REGISTRY}/${NAME}:${TAG} .
	docker tag ${REGISTRY}/${NAME}:${TAG} ${REGISTRY}/${NAME}:prod
	docker push ${REGISTRY}/${NAME}:${TAG} && docker push ${REGISTRY}/${NAME}:prod
