require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "an administrator provisions a user with a default profile" do
    administrator = User.create!(email: "admin@example.com", admin: true)
    sign_in_as(administrator)

    assert_difference ["User.count", "Profile.count"], 1 do
      post api_v1_users_path,
        params: {
          email: "viewer@example.com"
        },
        as: :json
    end

    assert_response :created
    assert_equal "Default", User.find_by!(email: "viewer@example.com").profiles.first.name
  end

  test "a regular user cannot provision accounts" do
    viewer = User.create!(email: "viewer@example.com")
    sign_in_as(viewer)

    post api_v1_users_path,
      params: {
        email: "other@example.com"
      },
      as: :json

    assert_response :forbidden
  end
end
