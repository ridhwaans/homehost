require "test_helper"

class PlaybackPositionTest < ActiveSupport::TestCase
  test "position cannot exceed a positive duration" do
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
    position = profile.playback_positions.build(
      media_asset: asset,
      position_ms: 2_000,
      duration_ms: 1_000,
      last_played_at: Time.current
    )

    assert_not position.valid?
    assert_includes position.errors[:position_ms], "cannot exceed duration"
  end
end
