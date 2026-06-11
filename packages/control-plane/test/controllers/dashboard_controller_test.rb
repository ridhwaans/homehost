require "test_helper"

class DashboardControllerTest < ActionDispatch::IntegrationTest
  test "redirects signed-out visitors to passwordless login" do
    get dashboard_path

    assert_redirected_to new_login_path
  end

  test "renders the main pages for an administrator" do
    administrator = User.create!(email: "admin@example.com", admin: true)
    administrator.profiles.create!(name: "Default")
    sign_in_as(administrator)

    [
      dashboard_path,
      media_assets_path,
      processing_jobs_path,
      users_path,
      profiles_path,
      collections_path,
      audit_events_path
    ].each do |path|
      get path
      assert_response :success, "expected #{path} to render"
    end
  end

  test "login and logout use the Rails session cookie" do
    user = User.create!(email: "viewer@example.com")
    user.profiles.create!(name: "Default")

    post login_path, params: { email: user.email }
    assert_redirected_to dashboard_path

    delete logout_path
    assert_redirected_to new_login_path

    get dashboard_path
    assert_redirected_to new_login_path
  end

  test "renders media, job, and collection detail pages" do
    administrator = User.create!(email: "admin@example.com", admin: true)
    profile = administrator.profiles.create!(name: "Default")
    asset = MediaAsset.create!(
      engine_id: "asset-1",
      path: "/media/movie.mkv",
      kind: "video",
      status: "available",
      checksum: "checksum",
      byte_size: 1_024,
      modified_at: Time.current,
      metadata: { "format" => "matroska", "duration_ms" => 10_000 }
    )
    job = ProcessingJob.create!(
      engine_job_id: "job-1",
      job_type: "scan",
      state: "completed",
      progress: 100,
      requested_by: administrator
    )
    collection = profile.collections.create!(name: "Favorites")
    collection.collection_items.create!(media_asset: asset)
    sign_in_as(administrator)

    get media_asset_path(asset, profile_id: profile.id)
    assert_response :success
    assert_select "h1", text: "movie.mkv"

    get processing_job_path(job)
    assert_response :success
    assert_select "h1", text: "Scan"

    get collection_path(collection, profile_id: profile.id)
    assert_response :success
    assert_select "h1", text: "Favorites"
  end
end
