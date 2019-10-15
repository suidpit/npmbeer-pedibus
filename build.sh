!/bin/bash
cd frontend
./build-frontend.sh
cd ../
./build-backend.sh

docker-compose build
