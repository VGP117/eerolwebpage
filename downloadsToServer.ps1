gcloud compute scp --recurse $PSScriptRoot\eerolsite\public\downloads free-instance:~/temp
gcloud compute ssh --zone us-east1-b free-instance --command 'sudo /var/move.sh'