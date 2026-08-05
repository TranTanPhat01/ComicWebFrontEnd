function Invoke-Json($Method, $Url, $BodyString = $null, $Headers = @{}) {
    $params = @{
        Method = $Method
        Uri = $Url
        ContentType = "application/json"
        UseBasicParsing = $true
    }
    if ($null -ne $BodyString) {
        $params.Body = $BodyString
    }
    if ($Headers.Count -gt 0) {
        $params.Headers = $Headers
    }
    try {
        return Invoke-WebRequest @params
    } catch {
        Write-Error "Request to $Url failed: $_"
        if ($null -ne $_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errContent = $reader.ReadToEnd()
            Write-Host "Error Body: $errContent" -ForegroundColor Red
        }
        throw
    }
}

$token = $null
$defaultPassword = "Admin@Comic2026Strong"
$newPassword = "Admin@Comic2026StrongNew-54"

# Attempt to login using the new password first
try {
    Write-Host "Attempting login with updated password..."
    $loginBody = '{"usernameOrEmail":"admin","password":"' + $newPassword + '"}'
    $loginRes = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/auth/login" $loginBody
    $loginData = $loginRes.Content | ConvertFrom-Json
    $token = $loginData.data.accessToken
    Write-Host "Logged in successfully with updated password!" -ForegroundColor Green
} catch {
    Write-Host "Login with updated password failed. Attempting login with default password..." -ForegroundColor Yellow
    # Login with default password
    $loginBody = '{"usernameOrEmail":"admin","password":"' + $defaultPassword + '"}'
    $loginRes = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/auth/login" $loginBody
    $loginData = $loginRes.Content | ConvertFrom-Json
    $tempToken = $loginData.data.accessToken

    # Change password
    $changeBody = '{"currentPassword":"' + $defaultPassword + '","newPassword":"' + $newPassword + '","confirmPassword":"' + $newPassword + '"}'
    $changeRes = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/auth/change-password" $changeBody @{ Authorization = "Bearer $tempToken" }
    Write-Host "Password changed successfully." -ForegroundColor Green

    # Login again
    $loginBody = '{"usernameOrEmail":"admin","password":"' + $newPassword + '"}'
    $loginRes = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/auth/login" $loginBody
    $loginData = $loginRes.Content | ConvertFrom-Json
    $token = $loginData.data.accessToken
}

$headers = @{
    Authorization = "Bearer $token"
}

# Seed Stories (Using Unicode escaped Vietnamese names for Genres to match existing seeded genres)
$storiesJson = @(
    '{"title":"Huyen Thoai Luc Dia","slug":"huyen-thoai-luc-dia","description":"A beautiful fantasy adventure story set in an ancient fantasy world.","coverImageUrl":"http://localhost:3000/images/demo/cover-huyen-huyen-01.webp","authorName":"Author A","genres":["Huy\u00ea\u0300n Huy\u00ea\u0303n"]}',
    '{"title":"Hao Mon Than Hao","slug":"hao-mon-than-hao","description":"Urban billionaire romance and modern family struggle story.","coverImageUrl":"http://localhost:3000/images/demo/cover-do-thi-01.webp","authorName":"Author B","genres":["\u0110o\u0302 Thi\u0323"]}',
    '{"title":"Cuu Thien Kiem Ton","slug":"cuu-thien-kiem-ton","description":"Traditional martial arts sword cultivator striving for immortality.","coverImageUrl":"http://localhost:3000/images/demo/cover-tien-hiep-01.webp","authorName":"Author C","genres":["Ti\u00ea\u0302n Hi\u00ea\u0323p"]}',
    '{"title":"Ta O Di Gioi Làm Dai Gia","slug":"ta-o-di-gioi-lam-dai-gia","description":"A modern man reincarnated as a wealthy lord in another world.","coverImageUrl":"http://localhost:3000/images/demo/cover-xuyen-khong-01.webp","authorName":"Author D","genres":["Xuy\u00ea\u0302n Kho\u0302ng"]}',
    '{"title":"Bat Dau Nhan Duoc Hang Ty Thuoc Tinh","slug":"bat-dau-nhan-duoc-hang-ty-thuoc-tinh","description":"System level up story where MC gains billions of attribute points.","coverImageUrl":"http://localhost:3000/images/demo/cover-he-thong-01.webp","authorName":"Author E","genres":["H\u00ea\u0323 Tho\u0302\u0301ng"]}'
)

foreach ($storyJson in $storiesJson) {
    # Parse title for logs
    $storyObj = $storyJson | ConvertFrom-Json
    Write-Host "Creating story: $($storyObj.title)..."
    
    $storyRes = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/admin/stories" $storyJson $headers
    $storyData = $storyRes.Content | ConvertFrom-Json
    $storyId = $storyData.data.id
    $storyVersion = $storyData.data.version

    # Add chapter 1
    $chapterBody = '{"chapterNumber":1,"title":"Chapter 1: A New Beginning","slug":"chapter-1-a-new-beginning","content":"<p>This is the first chapter of our amazing story. Please enjoy the read.</p>"}'
    Write-Host "Creating chapter 1 for $($storyObj.title)..."
    $chapterRes = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/admin/stories/$storyId/chapters" $chapterBody $headers
    $chapterData = $chapterRes.Content | ConvertFrom-Json
    $chapterId = $chapterData.data.id
    $chapterVersion = $chapterData.data.version

    # Publish chapter
    Write-Host "Publishing chapter..."
    $pubChapter = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/admin/chapters/$chapterId/publish" ('{"version":' + $chapterVersion + '}') $headers
    $pubChapterData = $pubChapter.Content | ConvertFrom-Json

    # Publish story
    Write-Host "Publishing story..."
    $pubStory = Invoke-Json "Post" "http://127.0.0.1:8080/api/v1/admin/stories/$storyId/publish" ('{"version":' + $storyVersion + '}') $headers
    Write-Host "Seeded and published story successfully!" -ForegroundColor Green
}
