class FeedChannel < ApplicationCable::Channel
  def subscribed
    # Cada usuario suscrito debe recibir su propio feed.
    stream_from "feed_general"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
