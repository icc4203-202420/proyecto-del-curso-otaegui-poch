class API::V1::FriendshipsController  < ApplicationController
        def index
          user_id = params[:user_id]
          friendships = Friendship.where(user_id: user_id)
  
          # Si deseas obtener detalles de los amigos, puedes mapear los `friend_id` a los usuarios
          friends = friendships.map do |friendship|
            {
              id: friendship.id,
              user_id: friendship.user_id,
              friend_id: friendship.friend_id
            }
          end
  
          render json: { friendships: friends }
        end
      end
    

  