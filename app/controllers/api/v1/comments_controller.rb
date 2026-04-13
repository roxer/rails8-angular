class Api::V1::CommentsController < ApplicationController
  before_action :load_article

  def index
    if @article
      comments = @article.comments
    else
      comments = Comment.all
    end

    render json: comments
  end

  def create
    if @article
      com = @article.comments.create!(comment_params)

      render json: com
    end
  end

  private

  def load_article
    if aid = params[:article_id]
      @article = Article.find(aid)
    end
  end

  def comment_params
    params.require(:comment).permit(:body, :author)
  end
end
