gcloud compute scp $PSScriptRoot\eerolsite\server.js free-instance:~/temp
gcloud compute ssh --zone us-east1-b free-instance --command 'sudo /var/move.sh'