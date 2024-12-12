# Grafana annotations

🔑 **Key points**

- Grafana supports annotated visualizations.
- Experiment creating annotations with Curl.
- Modify the CI pipeline so that an annotation is created on release events.

---

When you are reviewing your dashboards to figure out where things went wrong it is often helpful if key events, such as a deployment, are annotated on the visualization.

![Annotation example](annotationExample.png)

You can add an annotation manually by clicking on a visualization data point and pressing the `Add annotation` button. However, for many events you want to automate the generation of an annotation so that they are always there for key points.

## Obtaining an access token

In order to automate Grafana interactions using the Grafana HTTP API, you need a service account token. Take the following steps to obtain a token:

1. Open the Grafana Cloud Dashboard.
1. Open the home menu and click on `Administration`, `Users and access`, and then `Service accounts`.
1. Press the `Add service account` button.

   1. Give a `Display name` of **CI**.
   1. Assign the role of **Editor**.

      ![Create service account](createServiceAccount.png)

   1. Press the `Create` button. This should display your newly created **CI** service account.

1. On the **CI** service account page, press `Add service account token`.
   1. Press the `Generate token` button.
   1. Copy the generated token and store it somewhere safe.

## Automating annotation generation

With your newly minted service account token, you can create an annotation by using the [Grafana Annotations HTTP API](https://grafana.com/docs/grafana/latest/developers/http_api/annotations/). This API provides the ability to specify a dashboard and panel on which to create the annotation, along with the text, tags, and timestamp of the annotation.

### Getting your dashboard and panel IDs

You need to know the ID of the dashboard and panel that you want to create the annotation on. You can get the IDs by opening up the desired dashboard in your browser and viewing a specific panel. The URL displayed in the browser contains the IDs that you want.

```txt
https://byu.grafana.net/d/xyz123/jwt-pizza?orgId=1&viewPanel=panel-14
```

In the above example the Dashboard ID is `xyz123` and the panel ID is `14`.

### Creating a annotation with Curl

Now that you have your service account token and the desired IDs, you can use Curl to make the API call. This call has the following format.

```txt
curl -X POST https://YOUR-GRAFANA-CLOUD-DOMAIN.grafana.net/api/annotations -H "Authorization: Bearer YOUR-SERVICE-ACCOUNT-TOKEN" -H "Content-Type:application/json" -d '{"dashboardUID":"YOUR-DASHBOARD-ID", "panelId":YOUR-PANEL-ID, "text":"Your annotation text" }'
```

For example:

```sh
curl -X POST https://youraccountname.grafana.net/api/annotations -H "Authorization: Bearer 111111" -H "Content-Type:application/json" -d '{"dashboardUID":"xyz123", "panelId":14, "text":"Version 20240312.121212 deployed" }'
```

This should return the something like the following and create an annotation on the visualization represented by the panel at the current time.

```json
{
  "id": 3,
  "message": "Annotation added"
}
```

You can also provide a UNIX timestamp if you want to create an annotation for a specific time.

If you go view your dashboard you should see the annotation.

![Deployment annotation](deploymentAnnotation.png)

## ☑ Exercise

Now that you know how to add annotations, go and add annotation generation to your CI workflows. You will need to add a new secret to GitHub Actions that represents your Grafana service access token. Name this `GRAFANA_ACCESS_TOKEN`. Then add something similar to the following to your workflow. This assumes that you have a version number assigned to an environment variable named `version`. Replace the Grafana hostname, dashboard ID, and panel ID with your values. Also set the **tags** field as appropriate for the component and environment that you are deploying.

```yml
- name: Annotate deployment in Grafana
  run: |
    curl -s -X POST https://youraccountname.grafana.net/api/annotations -H "Authorization: Bearer ${{ secrets.GRAFANA_ACCESS_TOKEN }}" -H "Content-Type:application/json" -d '{"dashboardUID":"xyz123", "panelId":15, "tags":["backend","production"], "text":"Version '"$version"' deployed" }'
```
