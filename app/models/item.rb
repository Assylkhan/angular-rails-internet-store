class Item < ActiveRecord::Base
  has_attached_file :image,
                    :path => '/images/:id/:filename',
                    :default_url => "/images/:id/:filename",
                    :storage => :s3,
                    :bucket => 'Angular-rails-store'

  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
  has_many :positions
  has_many :orders, through: :positions

  validates :name, presence: true
  validates :view, presence: true
  validates :real_price, presence: true, numericality: { greater_than: 0}
  validates :price, presence: true, numericality: { greater_than: 0}
  validates :count, presence: true, numericality: { greater_than: 0}
  validates :weight, presence: true, numericality: { greater_than: 0}

end
