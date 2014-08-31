class OrdersController < ApplicationController
  respond_to :html, :json

  def index
    if isAdmin?
      flash.keep
      orders = Order.page(params[:page]).per(20)
      range = Array.new
      (params[:page].to_i-2).upto(params[:page].to_i+2) { |i| range << i}
      range.delete_if { |index| index<1 || index>(Order.count/20.0).ceil }
      
      data = {}
      data[:orders] = Array.new
      count = 0
      Order.all.each do |index|
        data[:orders][count] = {}
        data[:orders][count][:order_id] = index.id
        data[:orders][count][:client_email] = User.find_by(id: index.user_id).email
        data[:orders][count][:summ] = index.summ
        data[:orders][count][:received_date] = index.updated_at
        count = count.next
      end
      data[:orders_count] = Order.count
      data[:range] = range
      data[:currentPage] = params[:page]

      respond_with(data) do |format|
        format.json {render json: data.as_json }
      end
    end
  end

  def create
    array = Array.new
    count = 0
    current_user.orders.build
    if current_user.orders.last.save
      summ = 0
      params[:cart].map do |index|
        current_user.orders.last.positions.create(item_id: index["id"], quantity: index["quantity"])
        summ += index["quantity"]*Item.find_by(id: index["id"]).price
      end
      puts summ
      current_user.orders.last.summ = summ
      current_user.orders.last.save

      respond_with(current_user.orders.last) do |format|
        format.json {render json: current_user.orders.last.as_json}
      end
    end
  end

  def show
    order = Order.find_by(id: params["id"])
    items = []
    count = 0
    order.items.each do |index|
      item = {}
      item[:id]       = index.id
      item[:name]     = index.name
      item[:view]     = index.view
      item[:quantity] = order.positions.find_by(item_id: index.id).quantity
      item[:price]    = index.price
      items[count]    = item
      count = count.next
    end
    respond_with(items) do |format|
      format.json {render json: items.as_json}    
    end
  end

end