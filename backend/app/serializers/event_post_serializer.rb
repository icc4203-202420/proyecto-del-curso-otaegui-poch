class EventPostSerializer < ActiveModel::Serializer
  attributes :id, :description, :pictures_url, :created_at, :event_name, :content, :user_name, :bar_name

  def user_name
    object.user.name
  end

  def bar_name
    object.bar.name if object.bar
  end

  def event_name
    object.event.name
  end
end
