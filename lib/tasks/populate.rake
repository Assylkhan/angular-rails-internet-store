namespace :db do
  desc "Fill database with simple data"
  task populate: :environment do
    100.times do |n|
      puts "[DEBUG] creating item #{n+1} of 100"
      name = Faker::Name.name
      description = Faker::Lorem.paragraph
      real_price = Faker::Number.number(2)
      price = (real_price*1.5).ceil
      views = ["kettle", "sofa", "TV", "notebook", "bookreader", "wireless router", "whiskas", "umbrella", "book"]
      view = views.at(Random.rand(views.count))
      weight = Random.rand(10.0).round(2)
      count = Random.rand(10)

      Item.create!( name: name,
                    description: description,
                    real_price: real_price,
                    price: price,
                    weight: weight,
                    count: count,
                    view: view)
    end

    Item.all.each do |item|
      puts "[DEBUG] uploading images for item #{item.id} of #{Item.last.id}"
      item.image = File.open(Dir.glob(File.join(Rails.root, 'sampleimages', '*')).sample)
      item.image_url = item.image.url
      item.save!
    end
  end
end