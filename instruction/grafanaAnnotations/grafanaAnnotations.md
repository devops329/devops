# Grafana annotations

🔑 **Key points**

- Understand how Grafana supports annotated visualizations for event tracking.
- Learn to create annotations manually and via the HTTP API using Curl.
- Integrate automated annotations into a CI/CD pipeline to track release events.

---

When reviewing dashboards to diagnose issues, it is helpful to see key events—such as deployments or configuration changes—marked directly on the visualization. These markers are called **annotations**.

![Annotation example](annotationExample.png)

You can add an annotation manually by clicking on a data point in a visualization and selecting the **Add annotation** button. However, for recurring events like deployments, you should automate the process so that markers are consistently applied across your dashboards.

## Obtaining an access token

To automate Grafana interactions using the HTTP API, you need a service account token. Follow these steps to obtain one:

1. Log in to your **Grafana Cloud Dashboard**.
1. Open the **Home** menu and navigate to **Administration** > **Users and access** > **Service accounts**.
1. Click the **Add service account** button.
   1. Enter **CI** as the **Display name**.
   2. Assign the role of **Editor**.

      ![Create service account](createServiceAccount.png)

   3. Click **Create**. This will open the page for your new **CI** service account.

1. On the **CI** service account page, click **Add service account token**.
   1. Click **Generate token**.
   2. Copy the generated token and store it in a secure location (e.g., a password manager). **You will not be able to see it again.**

## Automating annotation generation

With your service account token, you can create annotations using the [Grafana Annotations HTTP API](https://grafana.com/docs/grafana/latest/developers/http_api/annotations/). This API allows you to specify the target dashboard and panel, along with the text, tags, and timestamp for the annotation.

### Getting your dashboard and panel IDs

To target a specific visualization, you need the **Dashboard UID** and the **Panel ID**. You can find these in the URL when viewing a specific panel in your browser.

```txt
https://youraccount.grafana.net/d/xyz123/jwt-pizza?orgId=1&viewPanel=14
```

In the example above:

- The **Dashboard UID** is `xyz123`.
- The **Panel ID** is `14`.

### Creating an annotation with Curl

Once you have your service account token and IDs, you can use `curl` to make the API call. Use the following format:

```sh
curl -X POST https://YOUR-GRAFANA-CLOUD-DOMAIN.grafana.net/api/annotations \
-H "Authorization: Bearer YOUR-SERVICE-ACCOUNT-TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "dashboardUID":"YOUR-DASHBOARD-UID",
  "panelId":YOUR-PANEL-ID,
  "text":"Your annotation text"
}'
```

**Example:**

```sh
curl -X POST https://youraccountname.grafana.net/api/annotations \
-H "Authorization: Bearer 111111" \
-H "Content-Type: application/json" \
-d '{"dashboardUID":"xyz123", "panelId":14, "text":"Version 20240312.121212 deployed" }'
```

If successful, the API returns a confirmation message and the annotation ID:

```json
{
  "id": 3,
  "message": "Annotation added"
}
```

By default, the annotation is created at the current time. You can also provide a `time` field with a UNIX timestamp (in milliseconds) to create an annotation for a specific historical event.

When you view your dashboard, the annotation will appear as a vertical line or a marker on the graph.

![Deployment annotation](deploymentAnnotation.png)

## ☑ Exercise

Now that you can manually trigger annotations, integrate this process into your CI/CD workflow.

1. Add a new **Repository Secret** to your GitHub repository named `GRAFANA_ACCESS_TOKEN` using the service account token you generated earlier.
2. Add a step to your GitHub Actions workflow similar to the one below.
3. Ensure you replace the hostname, dashboard UID, and panel ID with your specific values.

_Note: This example assumes you have a version number assigned to an environment variable named `$version`._

```yml
- name: Annotate deployment in Grafana
  run: |
    curl -s -X POST https://youraccountname.grafana.net/api/annotations \
    -H "Authorization: Bearer ${{ secrets.GRAFANA_ACCESS_TOKEN }}" \
    -H "Content-Type: application/json" \
    -d '{"dashboardUID":"xyz123", "panelId":15, "tags":["backend","production"], "text":"Version '"$version"' deployed" }'
```

```masteryls
{"id":"afe37413-ccc0-4996-bc06-d97831bab8ae", "title":"Grafana annotations", "type":"file-submission", "gradingCriteria":"A Grafana metric panel that contains an annotation"  }
Submit a screenshot of your dashboard displaying your deployment annotation.
```
