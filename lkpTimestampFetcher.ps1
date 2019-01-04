$path = [Environment]::GetFolderPath("MyDocuments")
git -C "$path\Visual Studio 2017\Projects\lentokonepeli" tag -l --format='%(refname)   %(creatordate:short)'
Pause