class CreateControlPlane < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.boolean :admin, null: false, default: false
      t.timestamps
    end
    add_index :users, "lower(email)", unique: true, name: "index_users_on_lower_email"

    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :content_rating_limit
      t.timestamps
    end
    add_index :profiles, %i[user_id name], unique: true

    create_table :media_assets do |t|
      t.string :engine_id, null: false
      t.string :path, null: false
      t.string :kind, null: false
      t.string :status, null: false, default: "available"
      t.string :checksum, null: false
      t.bigint :byte_size, null: false
      t.datetime :modified_at, null: false
      t.json :metadata, null: false, default: {}
      t.timestamps
    end
    add_index :media_assets, :engine_id, unique: true
    add_index :media_assets, :path, unique: true
    add_index :media_assets, %i[kind status]

    create_table :playback_positions do |t|
      t.references :profile, null: false, foreign_key: true
      t.references :media_asset, null: false, foreign_key: true
      t.bigint :position_ms, null: false, default: 0
      t.bigint :duration_ms, null: false, default: 0
      t.boolean :completed, null: false, default: false
      t.datetime :last_played_at, null: false
      t.timestamps
    end
    add_index :playback_positions, %i[profile_id media_asset_id], unique: true, name: "index_playback_on_profile_and_asset"

    create_table :collections do |t|
      t.references :profile, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.timestamps
    end
    add_index :collections, %i[profile_id name], unique: true

    create_table :collection_items do |t|
      t.references :collection, null: false, foreign_key: true
      t.references :media_asset, null: false, foreign_key: true
      t.integer :position, null: false
      t.timestamps
    end
    add_index :collection_items, %i[collection_id media_asset_id], unique: true
    add_index :collection_items, %i[collection_id position], unique: true

    create_table :processing_jobs do |t|
      t.string :engine_job_id, null: false
      t.string :job_type, null: false
      t.string :state, null: false
      t.integer :progress, null: false, default: 0
      t.text :error
      t.json :request_payload, null: false, default: {}
      t.json :result, null: false, default: {}
      t.references :requested_by, foreign_key: { to_table: :users }
      t.datetime :started_at
      t.datetime :finished_at
      t.timestamps
    end
    add_index :processing_jobs, :engine_job_id, unique: true
    add_index :processing_jobs, %i[state created_at]

    create_table :audit_events do |t|
      t.string :action, null: false
      t.references :actor, polymorphic: true
      t.references :auditable, polymorphic: true
      t.json :metadata, null: false, default: {}
      t.timestamps
    end
    add_index :audit_events, %i[action created_at]
  end
end
