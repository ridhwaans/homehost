email = ENV.fetch("ADMIN_EMAIL", "admin@homehost.local")

user = User.find_or_initialize_by(email: email)
user.admin = true
user.save!
user.profiles.find_or_create_by!(name: "Default")

puts "Created administrator #{email}"
