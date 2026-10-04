require "test_helper"

class ProfilesControllerTest < ActionDispatch::IntegrationTest
  test "an administrator cannot delete their final profile through the API" do
    administrator = User.create!(email: "admin@example.com", admin: true)
    profile = administrator.profiles.create!(name: "Default")
    sign_in_as(administrator)

    assert_no_difference "Profile.count" do
      delete "/api/v1/profiles/#{profile.id}", as: :json
    end

    assert_response :unprocessable_entity
    assert_equal 1, administrator.profiles.count
  end
end
