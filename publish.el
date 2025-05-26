;;; publish.el -*- lexical-binding: t; -*-

(setq org-publish-project-alist
      `(("blog"
         :base-directory "~/code/blog/src/org/content/"
         :publishing-function org-html-publish-to-html
         :publishing-directory "~/code/blog/generated/"
         :section-numbers nil
         :with-toc nil
         :html-head-include-default-style nil
         :html-head-include-scripts nil
         :html-head-extra ,(with-temp-buffer
                             (insert-file-contents "~/code/blog/src/org/templates/head.html")
                             (buffer-string))
         :html-preamble nil)
        ("org-created"
         :base-directory "~/code/blog/src/org/content/images"
         :base-extension "jpg\\|gif\\|png"
         :publishing-function org-publish-attachment
         :publishing-directory "~/code/blog/generated/images"
         )
        ("theme-assets"
         :base-directory "~/code/blog/content/assets/"
         :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf"
         :publishing-directory "~/code/blog/generated/assets/"
         :recursive t
         :publishing-function org-publish-attachment
         )
        )
      )
