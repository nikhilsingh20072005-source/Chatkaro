import React, {
  useEffect,
  useState,
} from "react";

const ChatSearch = ({
  messages = [],
  onSelectMessage,
  placeholder = "Search messages...",
}) => {
  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  useEffect(() => {
    const searchText =
      query.trim().toLowerCase();

    if (!searchText) {
      setResults([]);
      return;
    }

    const filtered =
      messages.filter((message) => {
        const content =
          message?.content ||
          message?.text ||
          "";

        return content
          .toLowerCase()
          .includes(searchText);
      });

    setResults(filtered);
  }, [query, messages]);

  const handleSelect = (
    message
  ) => {
    onSelectMessage?.(message);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="chat-search">
      <div className="chat-search-input-wrapper">
        <span className="chat-search-icon">
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
          placeholder={placeholder}
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            className="chat-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {query.trim() && (
        <div className="chat-search-results">
          {results.length === 0 ? (
            <div className="chat-search-empty">
              <span>
                🔎
              </span>

              <p>
                No messages found
              </p>
            </div>
          ) : (
            <>
              <div className="chat-search-count">
                {results.length}{" "}
                {results.length === 1
                  ? "message"
                  : "messages"}{" "}
                found
              </div>

              {results.map(
                (message, index) => {
                  const id =
                    message?._id ||
                    message?.id ||
                    index;

                  const content =
                    message?.content ||
                    message?.text ||
                    "";

                  const sender =
                    message?.sender ||
                    message?.user ||
                    {};

                  const senderName =
                    sender.username ||
                    sender.name ||
                    "User";

                  return (
                    <button
                      type="button"
                      key={id}
                      className="chat-search-result"
                      onClick={() =>
                        handleSelect(
                          message
                        )
                      }
                    >
                      <strong>
                        {senderName}
                      </strong>

                      <span>
                        {content}
                      </span>
                    </button>
                  );
                }
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSearch;