;;; publish.el -*- lexical-binding: t; -*-

;; https://writepermission.com/org-blogging-rss-feed.html

(defun +blog/org-rss-publish-to-rss (plist filename pub-dir)
  "Publish RSS with PLIST, only when FILENAME is 'rss.org'.
PUB-DIR is when the output will be placed."
  (if (equal "rss.org" (file-name-nondirectory filename))
      (org-rss-publish-to-rss plist filename pub-dir)))

(defun +blog/format-rss-feed (title list)
  "Generate RSS feed, as a string.
TITLE is the title of the RSS feed.  LIST is an internal
representation for the files to include, as returned by
`org-list-to-lisp'.  PROJECT is the current project."
  (concat "#+TITLE: " title "\n\n"
          (org-list-to-subtree list 1 '(:icount "" :istart ""))))

(defun +blog/format-rss-feed-entry (entry style project)
  "Format ENTRY for the RSS feed.
ENTRY is a file name.  STYLE is either 'list' or 'tree'.
PROJECT is the current project."
  (cond ((not (directory-name-p entry))
         (let* ((file (org-publish--expand-file-name entry project))
                (title (org-publish-find-title entry project))
                (date (format-time-string "%Y-%m-%d" (org-publish-find-date entry project)))
                (link (concat (file-name-sans-extension entry) ".html")))
           (with-temp-buffer
             (org-mode)
             (insert (format "* [[file:%s][%s]]\n" file title))
             (org-set-property "RSS_PERMALINK" link)
             (org-set-property "PUBDATE" date)
             (insert-file-contents file)
             (buffer-string)
             (goto-char (point-min))
             (forward-paragraph 3)
             (delete-region (point) (point-max))
             (buffer-string))
           ))
        ((eq style 'tree)
         ;; Return only last subdir.
         (file-name-nondirectory (directory-file-name entry)))
        (t entry)))

(setq org-publish-project-alist
      `(("blog"
         :base-directory "~/code/blog/src/org/content/"
         :publishing-function org-html-publish-to-html
         :publishing-directory "~/code/blog/generated/"
         :section-numbers nil
         :with-toc nil
         :html-head-include-default-style nil
         :html-head-include-scripts nil
         :html-preamble nil)
        ("blog-rss"
         :base-directory "~/code/blog/src/org/content/"
         :exclude ,(regexp-opt '("rss.org" "index.org" "404.org"))
         :publishing-function +blog/org-rss-publish-to-rss
         :publishing-directory "~/code/blog/generated/"
         :rss-extension "xml"
         :html-link-home "https://marc-bowes.com"
         :html-link-use-abs-url t
         :html-link-org-files-as-html t
         :auto-sitemap t
         :sitemap-filename "rss.org"
         :sitemap-title "marc-bowes.com"
         :sitemap-style list
         :sitemap-sort-files anti-chronologically
         :sitemap-function +blog/format-rss-feed
         :sitemap-format-entry +blog/format-rss-feed-entry)
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
