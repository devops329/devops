# Notes

## Boundary Permission

In the BYU AWS account you have to give permissions boundary to any role you create if it is going to assume other roles. Add: `iamRolePermissionBoundary`

## Testing user

- byucsstudent (CS email)

## Image manipulation

### Resize image

```sh
ffmpeg -i $imageFile -vf scale=$size:-1 -q 1 $newImageFile
```

### Resize png image without loosing transparency

```sh
ffmpeg -i x.png -vf scale=75:-1 -pred mixed -y -pix_fmt rgba caddyLogoS.png
```

### Animated gif creation

```sh
ffmpeg -i x.mov -filter_complex "[0:v] fps=6,scale=480:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" x.gif
```

### Launch multiple OBS

```sh
open -n -a OBS.app
```

Display properties crop 2500, 1400

### Multi-cam editing in DaVinci

    https://www.youtube.com/watch?v=ZzPZe36RdkU

## Handling a merge conflict with the remote

```sh
git remote add upstream https://github.com/devops329/jwt-pizza-service.git
git fetch upstream
git checkout main
git merge upstream/main
```

## Triggering chaos

You trigger an injection for a learner with a call like:

```sh
curl -X PUT http://localhost:4000/api/admin/vendor/111111 -H "Content-Type:application/json" -H "authorization:Bearer xxxx" -d '{"chaos":{"type":"badjwt|fail|throttle"}}' | jq '.'
```

This will cause a `reportUrl` field to start appearing on pizza order requests. The location of the field will differ depending on the injection type. However, it always shows up and if they debug or have good logs they should be able to find it easily.

```sh
{
    "order": {
        "items": [
            {
                "menuId": 1,
                "description": "Veggie",
                "price": 0.0038
            }
        ],
        "storeId": "2",
        "franchiseId": 1,
        "id": 155
    },
    "jwt": "jwthere",
    "reportUrl": "http://pizza-factory.cs329.click/api/support/1111111/report/22222222"
}
```

The learner the calls that url and the problem goes away. In the factory I track when the chaos was injected and when it was resolved.

```json
{
  "chaos": {
    "type": "none",
    "errorDate": "2024-06-07T22:28:40.174Z",
    "fixDate": "2024-06-07T22:28:40.170Z"
  }
}
```

## Creating a Pizza Factory vendor

```sh
curl -X POST https://pizza-factory.cs329.click/api/admin/vendor -H 'authorization: Bearer 9s32@352.kfdi(l4;' -H 'Content-Type:application/json' -d '{"id":"byucsstudent", "name":"BYU student"}'

{"apiKey":"b819cdd10d3f8d6fe49358e2c77e393e","vendor":{"id":"byucsstudent","name":"BYU student","created":"2024-07-01T19:12:45.187Z","validUntil":"2025-01-01T19:12:45.187Z"}}
```
