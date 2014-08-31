class ItemsController < ApplicationController
  respond_to :json, :html
  def index
    if params[:search]
      flash[:search] = params[:search]
    else
      flash[:search] = ''
    end
    flash.keep
    items = Item.where("name LIKE ?", "%#{flash[:search]}%").page(params[:page]).per(20)
    range = Array.new
    (params[:page].to_i-2).upto(params[:page].to_i+2) { |i| range << i}
    range.delete_if { |index| index<1 || index>(Item.where("name LIKE ?", "%#{flash[:search]}%").count/20.0).ceil }
    
    data = {}
    data[:items_count] = Item.where("name LIKE ?", "%#{flash[:search]}%").count
    data[:items] = items
    data[:range] = range
    data[:currentPage] = params[:page] 

    respond_with(data) do |format|
      format.json {render json: data.as_json }
    end
  end

  def create
    if isAdmin?
      item = Item.new
      item.image = params[:file]
      new_item = JSON.parse(params[:new_item])
      item.name = new_item["name"]
      item.real_price = new_item["real_price"]
      item.price = new_item["price"]
      item.description = new_item["description"]
      item.weight = new_item["weight"]
      item.count = new_item["count"]
      item.view = new_item["view"]
      # item.image_url = item.image.url if item.image

      if item.save
        respond_with(item) do |format|
          format.json {render json: item.as_json}
        end
      else
        data = {}
        data[:errors] = item.errors
        respond_with(data) do |format|
          format.json {render json: data.as_json}
        end
      end
    end
  end

  def update
    if isAdmin?  
      edit_item = JSON.parse(params[:edit_item])
      item = Item.find_by(id: edit_item["id"])
      item.image = params[:file] if params[:file]
      item.update_attributes(name: edit_item["name"], real_price: edit_item["real_price"],
                             price: edit_item["price"], description: edit_item["description"],
                             weight: edit_item["weight"], count: edit_item["count"],
                             view: edit_item["view"])
      if item.errors.empty?
        respond_with(item) do |format|
          format.json {render json: item.as_json}
        end
      else
      data = {}
      data[:errors] = item.errors
      respond_with(data) do |format|
        format.json {render json: data.as_json}
      end
      end
    end
  end

  def show
    item = Item.find_by(id: params[:id])
    respond_with(item) do |format|
      format.json {render json: item.as_json}
    end
  end

  def remove
    if isAdmin?
      item = Item.find_by(id: params[:id])
      item.destroy
      if item.destroyed?
        respond_to do |format|
          format.json {render json: "success"}
        end
      end
    end
  end

end
