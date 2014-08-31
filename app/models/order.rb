class Order < ActiveRecord::Base
  belongs_to :user
  has_many :positions
  has_many :items, through: :positions
  validates :summ, presence: true, numericality: { greater_than: 0}
end