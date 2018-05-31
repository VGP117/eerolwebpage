gcloud compute scp --recurse E:\Documents\EeroLWebpage\html\downloads free-instance:~/temp
gcloud compute ssh --zone us-east1-b free-instance --command 'sudo /var/move.sh'