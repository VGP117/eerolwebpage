Move-Item -Path $PSScriptRoot\html\images -Destination $PSScriptRoot
Move-Item -Path $PSScriptRoot\html\downloads -Destination $PSScriptRoot
gcloud compute scp --recurse E:\Documents\EeroLWebpage\html free-instance:~/temp
Move-Item -Path $PSScriptRoot\images -Destination $PSScriptRoot\html
Move-Item -Path $PSScriptRoot\downloads -Destination $PSScriptRoot\html
gcloud compute ssh --zone us-east1-b free-instance --command 'sudo /var/move.sh'
Pause