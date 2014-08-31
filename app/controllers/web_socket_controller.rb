class WebSocketController < WebsocketRails::BaseController
  def create
    Rails.logger.debug message
    # new_message = {:message => 'this is a message from server'}
    # user = current_user
    hash = {}
    hash[:items] = Array.new
    count = 0
    current_user.orders.last.items.each do |index|
      hash[:items][count][:item_id] = index.id
      hash[:items][count][:quantity] = current_user.orders.last.positions.find_by(item_id: index.id).quantity
      count = count.next
    end
    hash[:order] = current_user.orders.last
    send_message :new_order, hash
  end
end
