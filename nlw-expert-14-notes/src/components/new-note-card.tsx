import * as Dialog from "@radix-ui/react-dialog";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
    handleNoteCreated: (content: string) => void;
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  
const speechRecognition = new SpeechRecognitionAPI();

export function NewNoteCard ({handleNoteCreated} : NewNoteCardProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [shouldShowNoteOptions, setShouldShowNoteOptions] = useState(true);
    const [noteContent, setNoteContent] = useState("");

    function handleStartEditor() {
        setShouldShowNoteOptions(false);
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setNoteContent(event.target.value);

        if (event.target.value === "") {
            setShouldShowNoteOptions(true);
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();

        if (noteContent === "") {
            return;
        }

        handleNoteCreated(noteContent);
        setNoteContent("");
        setShouldShowNoteOptions(true);

        toast.success("Nota criada com sucesso!");
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 
        "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

        if(!isSpeechRecognitionAPIAvailable) {
            alert("Algo deu errado! Parece que seu navegador não suporta a API de reconhecimento de voz!");
            return;
        }

        setIsRecording(true);
        setShouldShowNoteOptions(false);

        speechRecognition.lang = "pt-BR";
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript);
            }, "");

            setNoteContent(transcription);
        }

        speechRecognition.onerror = (event) => {
            alert("Ops! Parece que houve um erro ao tentar realizar sua gravação. Por favor, tente novamente!");
            console.error(event);
        }

        speechRecognition.start();
    }

    function handleStopRecording() {
        setIsRecording(false);

        if (speechRecognition !== null) {
            speechRecognition.stop();
        }
    }

    return (
        <Dialog.Root>
        <Dialog.Trigger className="rounded-md bg-slate-700 p-5 space-y-3 text-left
        hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none
        flex flex-col justify-start items-left">
            <span className="text-sm font-medium text-slate-200">Adicionar Nota</span>

            <p className="text-sm leading-6 text-slate-400">
                Grave uma nota em áudio que será convertida em texto automaticamente.
            </p>
        </Dialog.Trigger>

        <Dialog.Portal>
            <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
            <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto
            md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
            md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
                <Dialog.Close className="absolute right-0 top-0 rounded-bl-md flex flex-col flex-center
                bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                    <span className="material-symbols-outlined">close</span>
                </Dialog.Close>

                <form onSubmit={handleSaveNote} className="flex-1 flex flex-col">
                    <div className="flex flex-1 flex-col gap-3 p-5">
                        <span className="text-sm font-medium text-slate-300">
                            Adicionar nota
                        </span>

                        {shouldShowNoteOptions ? (
                            <p className="text-sm leading-6 text-slate-400">
                                Comece{" "}
                                <button
                                onClick={handleStartRecording}
                                className="font-medium text-lime-400 hover:underline"
                                >
                                    gravando uma nota
                                </button>{" "}
                                em áudio ou se preferir{" "}
                                <button
                                className="font-medium text-lime-400 hover:underline"
                                onClick={handleStartEditor}>
                                    utilize apenas texto
                                </button>.
                            </p>
                        ) : (
                            <textarea
                            className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                            autoFocus
                            onChange={handleContentChanged}
                            value={noteContent}
                            />
                        )}
                    </div>
                    {isRecording ? (
                        <button
                        type="button"
                        onClick={handleStopRecording}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center
                        text-sm text-slate-200 outline-none font-medium hover:text-slate-100">
                            <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                            Gravando sua nota! Clique para interromper a gravação.
                        </button>
                    ) : (
                        <button type="button"
                        onClick={handleSaveNote}
                        className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none
                        font-medium hover:bg-lime-500">
                            Salvar Nota
                        </button>
                    )}
                </form>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )
}