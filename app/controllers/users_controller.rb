class UsersController < ApplicationController
  # require 'web_socket_controller.rb'
  respond_to :json, :html
  
  def create
    user = User.new(user_params)
    if user.save
      # new_message = {:message => 'this is a message'}
      # send_message :new_order, new_message
      sign_in user
      respond_with(user) do |format|
        format.json { render json: user.as_json }
      end
    else
      data = {}
      data[:errors] = user.errors
      respond_with(data) do |format|
        format.json {render json: data.as_json}
      end
    end
  end

  def destroy
    User.find_by(email: params[:email]).destroy
    respond_to do |format|
      format.json { render text: "yea"}
    end
  end

  def index
    if isAdmin?
      all_users = User.all
      users_count = User.count
      users = {}
      users[:data] = all_users
      users[:count] = users_count

      respond_with(users) do |format|
        format.json {render json: users.as_json}
      end
    end
  end

  private
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

end
