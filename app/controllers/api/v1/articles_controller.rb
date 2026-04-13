class Api::V1::ArticlesController < ApplicationController
  def index
    render json: Article.all
  end

  def show
    render json: Article.find(params[:id])
  end

  def create
    article = Article.create!(article_params)
    render json: article, status: :created
  end

  private

  def article_params
    params.require(:article).permit(:author, :title, :body)
  end
end
