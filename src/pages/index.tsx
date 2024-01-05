import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Link } from "@prisma/client";
import { ArrowRight, CheckIcon, CopyIcon } from "lucide-react";

import { api } from "../utils/trpc";

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  const [link, setLink] = useState<Link | null>(null);
  const [copied, setCopied] = useState(false);

  const create = api.link.create.useMutation({
    onSuccess: setLink,
    onError: () => alert("Could not create link"),
  });

  const onCreate = () => {
    create.mutate({ url });
  };

  const onCopy = (slug: string) => {
    setCopied(true);
    navigator.clipboard.writeText(`https://tincy.link/${slug}`);
    setTimeout(() => setCopied(false), 1000);
  };

  const Icon = copied ? CheckIcon : CopyIcon;

  return (
    <>
      <Head>
        <title>Tincy Link</title>
        <meta name="description" content="Create a tincy wincy link" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="flex h-screen bg-gray-50">
        <div className="m-auto flex w-full max-w-sm flex-col">
          <h1 className="text-center text-xl font-semibold text-slate-700">
            tincy.link
          </h1>
          <div className="mt-2 flex w-full flex-col rounded bg-white p-4 shadow-lg">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-10 rounded px-2"
            />
            <button
              className="mt-4 h-10 rounded bg-slate-700 text-white"
              onClick={onCreate}
              disabled={create.isLoading}
            >
              Create a tincy wincy link!
            </button>
          </div>
          {create.isLoading ? (
            <div className="relative mt-4 cursor-pointer rounded bg-white p-4 shadow-lg">
              <div className="mb-3 h-5 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform animate-pulse rounded bg-gray-200" />
            </div>
          ) : (
            link && (
              <div
                className="relative mt-4 cursor-pointer rounded bg-white p-4 shadow-lg"
                onClick={() => onCopy(link.slug)}
              >
                <p className="mb-1">https://tincy.link/{link.slug}</p>
                <div className="flex items-center gap-1 text-gray-600">
                  <ArrowRight className="h-3 w-3" />
                  <p className="text-sm">{link.url}</p>
                </div>
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 transform" />
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
