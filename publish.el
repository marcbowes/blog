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
         :html-preamble nil)))
