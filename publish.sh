#!/usr/bin/env doomscript

(defcli! publish-blog ()
  (doom-modules-initialize)      ; initialize the module system
  (doom-initialize t)            ; bootstrap Doom as if this were an interactive session
  (doom-startup)                 ; load your modules and user config

  (load "~/code/blog/publish.el")
  (require 'ob-ditaa)
  (setq org-ditaa-jar-path "/opt/homebrew/Cellar/ditaa/0.11.0_1/libexec/ditaa-0.11.0-standalone.jar")
  (org-publish-all)
)

(run! "publish-blog" (cdr (member "--" argv)))
