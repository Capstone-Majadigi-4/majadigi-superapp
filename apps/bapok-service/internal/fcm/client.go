package fcm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

const fcmEndpoint = "https://fcm.googleapis.com/fcm/send"

type Client struct {
	serverKey string
	http      *http.Client
}

func NewClient(serverKey string) *Client {
	return &Client{serverKey: serverKey, http: &http.Client{}}
}

type notification struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

type payload struct {
	To           string            `json:"to"`
	Notification notification      `json:"notification"`
	Data         map[string]string `json:"data,omitempty"`
}

func (c *Client) Send(token, title, body string, data map[string]string) error {
	if c.serverKey == "" || token == "" {
		return nil
	}

	p := payload{To: token, Notification: notification{Title: title, Body: body}, Data: data}
	b, err := json.Marshal(p)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, fcmEndpoint, bytes.NewReader(b))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "key="+c.serverKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("FCM returned status %d", resp.StatusCode)
	}
	return nil
}
