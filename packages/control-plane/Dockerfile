FROM ruby:3.4-alpine

RUN apk add --no-cache build-base sqlite-dev tzdata
WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .
RUN mkdir -p storage tmp/pids

EXPOSE 5200
CMD ["sh", "-c", "bin/rails db:prepare && bundle exec puma -C config/puma.rb"]
