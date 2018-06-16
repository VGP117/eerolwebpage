git add --all
git commit
git push origin master
gcloud compute ssh eero_lehtinen99@free-instance --zone us-east1-b --command "/var/updateSite.sh"
Pause