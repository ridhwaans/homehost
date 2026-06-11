require "test_helper"

class PlaybackPositionsControllerTest < ActionDispatch::IntegrationTest
  test "upserts playback state within the authenticated profile" do
    user = User.create!(email: "viewer@example.com")
    profile = user.profiles.create!(name: "Default")
    asset = MediaAsset.create!(
      engine_id: "asset-1",
      path: "/media/movie.mp4",
      kind: "video",
      status: "available",
      checksum: "checksum",
      byte_size: 10,
      modified_at: Time.current
    )

    sign_in_as(user)
    put upsert_api_v1_playback_positions_path,
      params: {
        profile_id: profile.id,
        media_asset_id: asset.id,
        position_ms: 500,
        duration_ms: 1_000
      },
      as: :json

    assert_response :success
    assert_equal 500, profile.playback_positions.find_by!(media_asset: asset).position_ms
  end
end
