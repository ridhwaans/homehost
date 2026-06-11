module ApplicationHelper
  def page_title(title = nil)
    content_for(:title, title) if title
    [content_for(:title), "Homehost Control Plane"].compact.join(" | ")
  end

  def status_badge(status)
    content_tag(:span, status.to_s.titleize, class: "badge badge--#{status}")
  end

  def media_name(asset)
    asset.metadata["title"].presence ||
      asset.metadata["name"].presence ||
      File.basename(asset.path)
  end

  def format_bytes(bytes)
    number_to_human_size(bytes || 0)
  end

  def navigation_link(label, path)
    classes = ["nav-link"]
    classes << "nav-link--active" if current_page?(path)
    link_to label, path, class: classes.join(" ")
  end
end
