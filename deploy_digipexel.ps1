$ftpHost = "digipexel.cluxn.com"
$ftpUser = "u723773599.u723773599"
$ftpPass = "Cluxnftp@12345"
$baseRemotePath = "public_html/digipexel"

function Upload-Folder($localRoot, $remoteRoot) {
    # Get the absolute path of the local root to accurately compute relative paths
    $localRootPath = (Resolve-Path $localRoot).Path
    
    Get-ChildItem -Path $localRoot -Recurse | Where-Object { ! $_.PSIsContainer } | ForEach-Object {
        $fullLocal = $_.FullName
        # Compute relative path by stripping the root folder name and preceding slash
        $relative = $fullLocal.Substring($localRootPath.Length + 1)
        # Construct the final remote Path
        $remoteFile = "$remoteRoot/$relative" -replace "\\", "/"
        Write-Host "Uploading: $fullLocal to $remoteFile"
        # --ftp-create-dirs is essential for subdirectories
        curl.exe --user "$ftpUser:$ftpPass" --ftp-create-dirs -T "$fullLocal" "ftp://$ftpHost/$remoteFile"
    }
}

# 1. Clean up some potential issues
Write-Host "Starting deployment to $ftpHost..."

# 2. Upload Backend to backend/ folder
# Local Root: backend, Remote Root: public_html/digipexel/backend
Upload-Folder "backend" "$baseRemotePath/backend"

# 3. Upload Frontend (out folder contains the static export) to root folder
# Local Root: frontend/out, Remote Root: public_html/digipexel
Upload-Folder "frontend/out" "$baseRemotePath"

Write-Host "Deployment Completed Successfully!"
