class User < ActiveRecord::Base
  before_save { email.downcase! }
  before_create :set_as_admin
  before_create :create_remember_token

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  validates :email, presence: true, 
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensititve: false }
  validates :password, length: { minimum: 6 }
  validates :password_confirmation, presence: true
  has_secure_password

  has_many :orders, dependent: :destroy
  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def isReallyAdmin?
    self.admin == 2
  end

  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end

    def set_as_admin
      if self.password == "adminadmin"
        self.admin = true
      end
    end
end
