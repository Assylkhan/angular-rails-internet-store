class SessionsController < ApplicationController
  respond_to :json, :html

  def isAuthenticated
    if signed_in?
      respond_to do |format|
        format.json { render json: "true"}
      end
    else
      cookies.delete(:remember_token)
    end
  end

  def current_user_to_browser
    if signed_in?
      respond_with(current_user) do |format|
        format.json { render json: current_user.as_json }
      end
    # else
    #   respond_to do |format|
    #     format.json { render json: "no such user"}
    #   end
    end
  end

  def create
    user = User.find_by(email: params[:session][:email].to_s.downcase)
    if user && user.authenticate(params[:session][:password])
      sign_in user
      respond_with(current_user) do |format|
        format.json { render json: current_user.as_json }
      end
    # else
    #   respond_to do |format|
    #     format.json { render json: "no"}
    #   end
    end
  end

  def destroy
    sign_out
    respond_to do |format|
      format.json { render json: "true"}
    end
  end

  def isAdmin
    if signed_in?
      if isAdmin?
        respond_to do |format|
          format.json {render json: "true"}
        end
      end
    end
  end

end
