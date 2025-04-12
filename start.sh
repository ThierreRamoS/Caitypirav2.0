#!/bin/bash

# Aumentar o limite de arquivos abertos
ulimit -n 10240

# Limpar o cache do metro bundler
rm -rf node_modules/.cache

# Iniciar o Expo
npx expo start --clear 