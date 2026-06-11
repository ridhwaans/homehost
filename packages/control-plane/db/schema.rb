# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_11_000000) do
  create_table "audit_events", force: :cascade do |t|
    t.string "action", null: false
    t.integer "actor_id"
    t.string "actor_type"
    t.integer "auditable_id"
    t.string "auditable_type"
    t.datetime "created_at", null: false
    t.json "metadata", default: {}, null: false
    t.datetime "updated_at", null: false
    t.index ["action", "created_at"], name: "index_audit_events_on_action_and_created_at"
    t.index ["actor_type", "actor_id"], name: "index_audit_events_on_actor"
    t.index ["auditable_type", "auditable_id"], name: "index_audit_events_on_auditable"
  end

  create_table "collection_items", force: :cascade do |t|
    t.integer "collection_id", null: false
    t.datetime "created_at", null: false
    t.integer "media_asset_id", null: false
    t.integer "position", null: false
    t.datetime "updated_at", null: false
    t.index ["collection_id", "media_asset_id"], name: "index_collection_items_on_collection_id_and_media_asset_id", unique: true
    t.index ["collection_id", "position"], name: "index_collection_items_on_collection_id_and_position", unique: true
    t.index ["collection_id"], name: "index_collection_items_on_collection_id"
    t.index ["media_asset_id"], name: "index_collection_items_on_media_asset_id"
  end

  create_table "collections", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name", null: false
    t.integer "profile_id", null: false
    t.datetime "updated_at", null: false
    t.index ["profile_id", "name"], name: "index_collections_on_profile_id_and_name", unique: true
    t.index ["profile_id"], name: "index_collections_on_profile_id"
  end

  create_table "media_assets", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "engine_id", null: false
    t.string "kind", null: false
    t.json "metadata", default: {}, null: false
    t.datetime "modified_at", null: false
    t.string "path", null: false
    t.string "status", default: "available", null: false
    t.datetime "updated_at", null: false
    t.index ["engine_id"], name: "index_media_assets_on_engine_id", unique: true
    t.index ["kind", "status"], name: "index_media_assets_on_kind_and_status"
    t.index ["path"], name: "index_media_assets_on_path", unique: true
  end

  create_table "playback_positions", force: :cascade do |t|
    t.boolean "completed", default: false, null: false
    t.datetime "created_at", null: false
    t.bigint "duration_ms", default: 0, null: false
    t.datetime "last_played_at", null: false
    t.integer "media_asset_id", null: false
    t.bigint "position_ms", default: 0, null: false
    t.integer "profile_id", null: false
    t.datetime "updated_at", null: false
    t.index ["media_asset_id"], name: "index_playback_positions_on_media_asset_id"
    t.index ["profile_id", "media_asset_id"], name: "index_playback_on_profile_and_asset", unique: true
    t.index ["profile_id"], name: "index_playback_positions_on_profile_id"
  end

  create_table "processing_jobs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "engine_job_id", null: false
    t.text "error"
    t.datetime "finished_at"
    t.string "job_type", null: false
    t.integer "progress", default: 0, null: false
    t.json "request_payload", default: {}, null: false
    t.integer "requested_by_id"
    t.json "result", default: {}, null: false
    t.datetime "started_at"
    t.string "state", null: false
    t.datetime "updated_at", null: false
    t.index ["engine_job_id"], name: "index_processing_jobs_on_engine_job_id", unique: true
    t.index ["requested_by_id"], name: "index_processing_jobs_on_requested_by_id"
    t.index ["state", "created_at"], name: "index_processing_jobs_on_state_and_created_at"
  end

  create_table "profiles", force: :cascade do |t|
    t.string "content_rating_limit"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id", "name"], name: "index_profiles_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.datetime "updated_at", null: false
    t.index "lower(email)", name: "index_users_on_lower_email", unique: true
  end

  add_foreign_key "collection_items", "collections"
  add_foreign_key "collection_items", "media_assets"
  add_foreign_key "collections", "profiles"
  add_foreign_key "playback_positions", "media_assets"
  add_foreign_key "playback_positions", "profiles"
  add_foreign_key "processing_jobs", "users", column: "requested_by_id"
  add_foreign_key "profiles", "users"
end
