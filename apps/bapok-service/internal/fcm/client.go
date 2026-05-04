package fcm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/oauth2/google"
)

const fcmV1Endpoint = "https://fcm.googleapis.com/v1/projects/%s/messages:send"

var fcmScopes = []string{"https://www.googleapis.com/auth/firebase.messaging"}

type Client struct {
	projectID   string
	credentials []byte
	http        *http.Client
}

func NewClient(projectID, credentialsJSON string) *Client {
	return &Client{
		projectID:   projectID,
		credentials: []byte(credentialsJSON),
		http:        &http.Client{},
	}
}

type fcmNotification struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

type fcmMessage struct {
	Token        string            `json:"token"`
	Notification fcmNotification   `json:"notification"`
	Data         map[string]string `json:"data,omitempty"`
}

type fcmPayload struct {
	Message fcmMessage `json:"message"`
}

func (c *Client) Send(ctx context.Context, token, title, body string, data map[string]string) error {
	if c.projectID == "" || len(c.credentials) == 0 || token == "" {
		return nil
	}

	creds, err := google.CredentialsFromJSON(ctx, c.credentials, fcmScopes...)
	if err != nil {
		return fmt.Errorf("fcm: parse credentials: %w", err)
	}

	oauthToken, err := creds.TokenSource.Token()
	if err != nil {
		return fmt.Errorf("fcm: get token: %w", err)
	}

	payload := fcmPayload{
		Message: fcmMessage{
			Token:        token,
			Notification: fcmNotification{Title: title, Body: body},
			Data:         data,
		},
	}

	b, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	url := fmt.Sprintf(fcmV1Endpoint, c.projectID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(b))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+oauthToken.AccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("fcm: status %d", resp.StatusCode)
	}
	return nil
}
