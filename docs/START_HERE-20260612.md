================================================================================
C:\AI\START_HERE.txt
================================================================================
Read this file once. Then navigate. You will not need to memorize anything.
================================================================================


== WHAT THIS SYSTEM IS =========================================================

C:\AI is a single-operator personal and creative workspace.
All work lives here. You are the agent. You navigate, build, and operate.
Mike directs. You execute, propose, and own the infrastructure.


== HOW TO ORIENT ===============================================================

You do not know the current state of anything until you look it up.
You do not know what projects exist until you query them.
You do not know tool locations, conventions, or specs until you find them.
This is not a gap. This is the method.

When Mike names something — a project, a tool, a task — your first move is:
  Run PowerShell to find it.
  Read what you find.
  Then respond.

Never answer from memory when the file system has the answer.
Never report a guess as a fact.
Never assume a prior task is complete.


== BUILD LOCK ==================================================================

Before touching any file in C:\AI\, check for a build lock:

  Get-Content "C:\AI\BUILD_LOCK.txt" -ErrorAction SilentlyContinue

If the file exists AND contains anything other than "UNLOCKED":
  - Do NOT modify any project files.
  - Tell Mike what the lock says and ask him to confirm before proceeding.
  - The only exception is reading files — reads are always safe.

When starting work on any project file:
  Set-Content "C:\AI\BUILD_LOCK.txt" -Value "LOCKED`nSession: [what you are working on]`nTaken: [current date/time]"

When done with all file changes in a session:
  Set-Content "C:\AI\BUILD_LOCK.txt" -Value "UNLOCKED"

This lock only prevents honest mistakes. It is not security.
If Mike explicitly tells you to override it, override it.


== THE FILE SYSTEM ==============================================================

C:\AI\                        Root. All work lives here.
  _system\                    Navigation docs and system-level files
  Projects\                   All projects live here
  Workspace\                  Tools, scripts, scratch
  Archive\                    Long-term storage
  Platform\                   Infrastructure projects
  Salvage\                    Reference-only rescued material

D:\AI_OK_TO_DELETE\           Quarantine. Move here instead of deleting.

D:\                           External drive. Backups and review material.


== KNOWN PROJECTS ===============================================================

ACTIVE
  Projects\weird-baby-update\   Weird.Baby Museum — primary build project
                                Read STATE.md first, then C:\AI\VISION.md
  Projects\Hunter Root\         Hunter Root content, tools, archive, yt research
                                Read STATE.md first, then PROJECT.md
  Projects\Lancaster_Property\  Property intelligence system for Matty
  Platform\MediaVault\          Media capture and cataloging platform

DORMANT (do not touch without asking)
  Projects\Genealogy\
  Projects\MGK-VIII\
  Projects\What_Mike_Knows\

SYSTEM
  _system\BACKLOG.md            System-level backlog items
  _system\OPERATOR.md           Operator conventions and identity
  _system\PROJECT_STANDARD.md   Standard for new project setup
  _system\TOOLS.md              Known tools and locations


== VISION AND NORTH STAR ========================================================

C:\AI\VISION.md               Read this before any Weird.Baby Museum session.
                              The museum is the entity. Hunter Root is the first exhibit.
                              Paired with: Projects\weird-baby-update\docs\COMPONENT_PHILOSOPHY.md


== HOW TO NAVIGATE — POWERSHELL ================================================

You do not browse. You query. Give Mike a PowerShell command to run.
He runs it. You read the output. You proceed.

COMMAND CONVENTIONS:
  1. Combine into a single command whenever possible. Chain with ; or use
     pipelines. Minimize round trips.
  2. PowerShell inline Python is unreliable. Always write a .py script file
     and execute it with: python "C:\AI\path\to\script.py"

Discover what exists:
  Get-ChildItem C:\AI\Projects\

Read a file:
  Get-Content "C:\AI\Projects\[ProjectFolder]\[file]"

Find files by name:
  Get-ChildItem C:\AI\ -Recurse -Filter "*keyword*"

Find files by content:
  Select-String -Path "C:\AI\**\*" -Pattern "keyword" -Recurse

Check if a path exists:
  Test-Path "C:\AI\[path]"

Move to quarantine (never delete):
  Move-Item "C:\AI\[file]" "D:\AI_OK_TO_DELETE\"

Write a file (Mike runs one command — agent produces the content):
  Set-Content -Path "C:\AI\[path]" -Value @"
  [content]
  "@
