Move-Item -Path $PSScriptRoot\eerolsite\.vscode -Destination $PSScriptRoot
Move-Item -Path $PSScriptRoot\eerolsite\server.js -Destination $PSScriptRoot
Move-Item -Path $PSScriptRoot\eerolsite\public\images -Destination $PSScriptRoot
Move-Item -Path $PSScriptRoot\eerolsite\public\downloads -Destination $PSScriptRoot
gcloud compute scp --recurse E:\Documents\EeroLWebpage\eerolsite free-instance:~/temp
Move-Item -Path $PSScriptRoot\.vscode -Destination $PSScriptRoot\eerolsite
Move-Item -Path $PSScriptRoot\server.js -Destination $PSScriptRoot\eerolsite
Move-Item -Path $PSScriptRoot\images -Destination $PSScriptRoot\eerolsite\public
Move-Item -Path $PSScriptRoot\downloads -Destination $PSScriptRoot\eerolsite\public
gcloud compute scp --recurse $PSScriptRoot\eerolsite\public\images free-instance:~/temp
gcloud compute scp --recurse $PSScriptRoot\eerolsite\public\downloads free-instance:~/temp
gcloud compute scp $PSScriptRoot\eerolsite\server.js free-instance:~/temp
gcloud compute ssh --zone us-east1-b free-instance --command 'sudo /var/move.sh'